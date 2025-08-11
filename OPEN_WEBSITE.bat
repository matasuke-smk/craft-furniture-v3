@echo off
echo クラフトファニチャーサイトを開いています...
echo.

REM Get the current directory
set "CURRENT_DIR=%~dp0"
echo Current Directory: %CURRENT_DIR%

REM Open the main website file
echo Opening index.html...
start "" "%CURRENT_DIR%index.html"

echo.
echo ✅ サイトが開きました！
echo.
echo 他のページにアクセスするには以下をブラウザで開いてください:
echo - 施工事例: %CURRENT_DIR%works\index.html
echo - 職人紹介: %CURRENT_DIR%craftsmen\index.html  
echo - 見積もり: %CURRENT_DIR%simulator\index.html
echo - ショールーム: %CURRENT_DIR%showroom\index.html
echo - お知らせ: %CURRENT_DIR%news\index.html
echo - 納品エリア: %CURRENT_DIR%delivery\index.html
echo.
pause