@echo off
set CI=true
set KIRO_NON_INTERACTIVE=true
set KIRO_YES=true

echo Starting... > kiro_log.txt

REM If Kiro still prompts, piping "y" + trailing "-" forces stdin mode:
echo y | kiro take task1 - >> kiro_log.txt 2>&1
echo y | kiro take task2 - >> kiro_log.txt 2>&1
echo y | kiro install packageA - >> kiro_log.txt 2>&1
echo y | kiro install packageB - >> kiro_log.txt 2>&1

echo Done. >> kiro_log.txt
pause
