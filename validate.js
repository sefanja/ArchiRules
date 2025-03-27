//
// Step 1. Export to RDF
//

console.clear();
console.show();

const RDF = [];
const ns = {
    archimate: "http://www.opengroup.org/xsd/archimate/3.0/#",
    model: "http://example.org/model#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#"
};

// Prefix declarations
RDF.push(`@prefix archimate: <${ns.archimate}> .`);
RDF.push(`@prefix model: <${ns.model}> .`);
RDF.push(`@prefix rdfs: <${ns.rdfs}> .\n`);

function toQName(id) {
    return `model:${id}`;
}

// Transforms Archi internal types to ArchiMate 3.0 spec
function normalizePredicate(rawType) {
    if (rawType.endsWith("-relationship")) {
        return rawType.replace("-relationship", "")
                      .split("-")
                      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                      .join("");
    } else {
        return rawType.split("-")
                      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                      .join("");
    }
}

// Export elements
$('element').each(e => {
    const subject = toQName(e.id);
    const predicate = `a archimate:${normalizePredicate(e.type)}`;
    RDF.push(`${subject} ${predicate} .`);
});

// Export relationships as direct triples
$('relationship').each(r => {
    const source = toQName(r.source.id);
    const target = toQName(r.target.id);
    const predicate = `archimate:${normalizePredicate(r.type)}`;
    RDF.push(`${source} ${predicate} ${target} .`);
});

// Output to file
const rdfPath = __DIR__ + "\\output\\model.ttl";
$.fs.writeFile(rdfPath, RDF.join('\n'), 'UTF8');
console.log("RDF export complete:", rdfPath);


//
// Step 2. Validate with SPARQL
//

const File = Java.type("java.io.File");
const ProcessBuilder = Java.type("java.lang.ProcessBuilder");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");

// Make a ProcessBuilder
const pb = new ProcessBuilder("cmd.exe", "/c", __DIR__ + "\\validate.cmd");
pb.directory(new File(__DIR__));

try {
    const process = pb.start();

    // Empty stdout to prevent hanging
    const reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
    let line = null;
    while ((line = reader.readLine()) != null) {
        console.log(line);
    }

    // Wait till done
    const exitCode = process.waitFor();
    console.log("Batch script completed with exit code " + exitCode);

} catch (e) {
    console.log("Failed to run validate.cmd: " + e);
}


//
// Step 3. Report validation results
//

console.log();
console.log("Validation result:");

function readAllText(path) {
    const file = new java.io.File(path);
    if (!file.exists()) {
        throw new Error("File not found: " + path);
    }
    const scanner = new java.util.Scanner(file).useDelimiter("\\Z");
    const text = scanner.hasNext() ? scanner.next() : "";
    scanner.close();
    return text;
}

const validationResults = JSON.parse(readAllText(__DIR__ + "\\output\\validationResults.json"));

Object.entries(validationResults).forEach(([rule, data]) => {
    const bindings = data.results.bindings;
    const count = bindings.length;

    if (count === 0) {
        console.log(`✔ no violations of rule ${rule}`);
    } else if (count <= 100) {
		let violations = [];

		for (let binding of data.results.bindings) {
			const labelParts = data.head.vars.map(varName => {
				const uri = binding[varName]?.value;
				const id = uri?.split("#").pop();
				const el = $("#" + id).first();
				return el ? el.name : `[${id}]`;
			});
			violations.push(labelParts.join(" × "));
		}

		// Output summary
		if (violations.length <= 100) {
			console.log(`⚠ ${count} violations of rule ${rule}: ${violations.join("; ")}`);
		} else {
			console.log(`⚠ ${count} violations of rule ${rule}`);
		}
    } else {
        console.log(`⚠ ${count} violations of rule ${rule}`);
    }
});

console.log();
console.log("Validation complete.");
