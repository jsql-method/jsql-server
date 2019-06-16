CALL rd /s /q "build"
CALL xcopy src\server.js build\server.js /s /e /h /f /a /Y /D
CALL install-local.bat