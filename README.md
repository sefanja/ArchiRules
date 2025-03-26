

# ArchiRules
Lightweight SPARQL-based model validation for [Archi](https://www.archimatetool.com/). It exports your model as RDF, runs SPARQL-based validation, and reports violations directly in the jArchi console.

## 📋 Features
-   Validate Archi models directly from inside Archi
-   Define rules declaratively in SPARQL
-   Feedback directly in the jArchi console
-   Works on Windows without admin rights
-   Requires the [jArchi plugin](https://www.archimatetool.com/plugins/)

## ▶️ Typical usage
1.  Open your model in Archi
2.  Run the `ArchiRules.ajs` script via jArchi
    -   Exports the model as RDF (Turtle)
    -   Executes SPARQL rules in the `rules` folder
    -   Reports violations in the jArchi console
4.  Review validation results in the console

## 📟 Example console output
```
✔ 0 elements violate rule C1
⚠ 2 elements violate rule C2: Customer Support; Order Fulfilment
⚠ 233 elements violate rule C3
```

If there are 100 or fewer violations, element names are shown. If more, only the count is displayed.

## 📐 SPARQL rule example
```sparql
# An element may not be composed (directly or indirectly) of itself.

PREFIX archimate: <http://www.opengroup.org/xsd/archimate/3.0/#>

SELECT ?x WHERE {
  ?x archimate:Composition+ ?x .
}
```

## 📦 Installation (Windows)
All files should be placed in a folder on your system, for example:
```
C:\Users\YourName\Downloads\ArchiRules\
```
Folder contents after installation:
```
ArchiRules\
├── validate.ajs     # jArchi script
├── validate.cmd     # Batch file to run all SPARQL rules
├── rules\           # SPARQL rules (e.g. C1.rq, C2.rq, ...)
├── tools\           
│   ├── jdk\         # Portable JDK
│   └── jena\        # Apache Jena
└── output\          # RDF export and validation results (created after first run)
```

### 1. jArchi script installation
To use the `validate.ajs` script inside Archi:
1.  Open Archi
2.  Go to `Scripts → Scripts Manager`, and click **New Archi Script**
3.  Name the new script `ArchiRules`
4.  In the script editor, paste the following line (adjust the path if needed):
	```javascript
      load("C:\\Users\\YourName\\Downloads\\ArchiRules\\validate.ajs");
5.  Save the script

### 2. JDK and Jena setup
Manually download and extract the following tools:
-   **Java JDK (portable):**  [Java Downloads](https://www.oracle.com/java/technologies/downloads/) (x64 Compressed Archive)
-   **Apache Jena:**  [Apache Jena Downloads](https://jena.apache.org/download/) (Apache Jena Commands)

Place them in the `tools\` directory as shown above.

## 📄 License
MIT
