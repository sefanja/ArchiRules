@echo off
setlocal ENABLEDELAYEDEXPANSION

set JENA_HOME=%cd%\tools\jena
set JAVA_HOME=%cd%\tools\jdk
set PATH=%JAVA_HOME%\bin;%PATH%

set DATA=output\model.ttl
set OUT=output\validationResults.js

echo const validationResults = { > %OUT%
set comma=
for %%f in (rules\*.rq) do (
	echo Running SPARQL validation for rule %%~nf...
	echo !comma! "%%~nf": >> %OUT%
	call %JENA_HOME%\bat\arq.bat --data %DATA% --query %%f --results=JSON >> %OUT%
	set comma=,
)
echo }; >> %OUT%

echo SPARQL validation complete: %cd%\%OUT%
