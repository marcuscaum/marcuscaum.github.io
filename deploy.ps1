#!/usr/bin/env pwsh

Write-Host "🚀 Iniciando deploy com Bun..." -ForegroundColor Green

# Build do projeto
Write-Host "📦 Fazendo build..." -ForegroundColor Yellow
bun run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build!" -ForegroundColor Red
    exit 1
}

# Copiar arquivos
Write-Host "📋 Copiando arquivos..." -ForegroundColor Yellow
Copy-Item "dist/src/index.html" "dist/index.html" -Force
Copy-Item "dist/index.html" "./" -Force

# Git operations
Write-Host "🔄 Fazendo commit e push..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: Update cyberpunk portfolio - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git push origin master

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "🌐 Portfolio disponível em: https://marcuscaum.github.io" -ForegroundColor Cyan