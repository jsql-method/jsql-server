@echo off
@chcp 1250 >nul

CALL prepare.bat
CALL build.bat
CALL test.bat

ECHO DID YOU CHANGE VERSION IN PRINTER?????????????????????????????????????????????????????

ECHO Set login and password to npm registry
CALL npm login

ECHO You are now logged as:
CALL npm whoami

ECHO.
ECHO Increment version, save file and press ENTER to publish
notepad package.json

ECHO Press ENTER to publish changes are into NPM registry
ECHO.
pause >nul
ECHO Changes are now publishing...
CALL npm publish

CALL npm logout

ECHO.
ECHO Press key to finish
pause >nul