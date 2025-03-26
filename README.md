# ArchiRules
Lightweight SPARQL-based model validation for [Archi](https://www.archimatetool.com/).  
It exports your model as RDF, runs SPARQL-based validation, and reports violations directly in the jArchi console.

## Features
-   Validate Archi models directly from inside Archi
-   Define rules declaratively in SPARQL
-   Feedback directly in the jArchi console
-   Works without admin rights
-   Requires the [jArchi plugin](https://www.archimatetool.com/plugins/)

## Typical usage
1.  Open your model in Archi
2.  Run the `ArchiRules.ajs` script via jArchi
    -   Exports the model as RDF (Turtle)
    -   Executes SPARQL rules in the `rules` folder
    -   Reports violations in the jArchi console
4.  Review validation results in the console

## Script installation
To use the `ArchRules.ajs` script inside Archi:
1.  Open Archi
2.  Go to `Scripts → Scripts Manager → New Archi Script`
3.  Give the new script a name, e.g. `ArchiRules`
4.  Replace the contents with the contents of the provided `ArchiRules.ajs` file (copy-paste)
5.  Save the script

The script will now be available in the Scripts window and can be run on any open model.

Alternatively, you can manually copy `ArchiRules.ajs` to the jArchi scripts folder.

## Project structure
```
ArchiRules\
├── ArchiRules.ajs   # jArchi script
├── validate.cmd     # Batch file to run all SPARQL rules
├── rules\           # SPARQL rules (e.g. C1.rq, C2.rq, ...)
├── output\          # RDF export and validation results
└── tools\               
  ├── jdk\           # Portable JDK
  └── jena\          # Apache Jena
```

## Example console output
```
✔ 0 elements violate rule C1
⚠ 2 elements violate rule C2: [Customer Support], [Order Fulfilment]
⚠ 233 elements violate rule C3
```

If there are 100 or fewer violations, element names are shown. If more, only the count is displayed.

## SPARQL rule example
**C2.rq**: detect composition cycles

```sparql
PREFIX archimate: <http://www.opengroup.org/xsd/archimate/3.0/#>

SELECT ?x WHERE {
  ?x archimate:Composition+ ?x .
}
```

## Setup requirements
ArchiRules requires no installation, but you must manually download and extract:
-   **Java JDK (portable):**  [Java Downloads](https://www.oracle.com/java/technologies/downloads/) (x64 Compressed Archive)
-   **Apache Jena:**  [Apache Jena Downloads](https://jena.apache.org/download/) (Apache Jena Commands)

Place both in the `tools/` directory as follows:
```
tools/
├── jdk/              # Extracted JDK folder
└── jena/             # Extracted Apache Jena distribution
```

No admin rights are required. The batch script will use the local copies.

## License
MIT
