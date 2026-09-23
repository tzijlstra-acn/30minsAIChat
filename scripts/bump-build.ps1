# bump-build.ps1 -- Update build fingerprint and cache-busting strings in pitch.html
# Usage: pwsh -File scripts/bump-build.ps1 [--dry-run]
#
# Reads the current git SHA, computes the version string, then replaces:
#   <meta name="nfr-build" content="vX-OLDSHA">  -> vNN-NEWSHA
#   ?v=OLDSHA                                     -> ?v=NEWSHA
#   story-manifest.json version field             -> NN
#
# The version number is derived from the highest vNN- prefix found in pitch.html.

param([switch]$DryRun)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$pitchPath = Join-Path $root 'pitch.html'
$manifestPath = Join-Path $root 'assets\data\story-manifest.json'

# 1. Get current git SHA (short)
$sha = & git -C $root rev-parse --short HEAD 2>$null
if (-not $sha) { throw 'Could not read git SHA. Run from within the repository.' }
$sha = $sha.Trim()

# 2. Read pitch.html
$html = [System.IO.File]::ReadAllText($pitchPath, [System.Text.Encoding]::UTF8)

# 3. Detect current version number from nfr-build meta
if ($html -match 'content="v(\d+)-([0-9a-f]{7})"') {
  $currentVer = [int]$Matches[1]
  $currentSha = $Matches[2]
} else {
  throw 'Could not find nfr-build meta tag in pitch.html'
}

if ($currentSha -eq $sha) {
  Write-Host "Build already at $currentVer-$sha -- nothing to update." -ForegroundColor Cyan
  exit 0
}

$newBuild = "v$currentVer-$sha"
$oldBuild = "v$currentVer-$currentSha"

Write-Host "Bumping build: $oldBuild -> $newBuild" -ForegroundColor Yellow

# 4. Replace in pitch.html
$html = $html.Replace($oldBuild, $newBuild)
$html = $html.Replace("?v=$currentSha", "?v=$sha")

if ($DryRun) {
  $count = ([regex]::Matches($html, [regex]::Escape($newBuild))).Count + `
           ([regex]::Matches($html, [regex]::Escape("?v=$sha"))).Count
  Write-Host "[DRY RUN] Would update ~$count occurrences. No files written." -ForegroundColor Cyan
  exit 0
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pitchPath, $html, $utf8NoBom)

# 5. Update manifest version if needed
$manifest = [System.IO.File]::ReadAllText($manifestPath, [System.Text.Encoding]::UTF8)
$manifest = [System.Text.RegularExpressions.Regex]::Replace(
  $manifest, '"version"\s*:\s*"(\d+)"', '"version": "' + $currentVer + '"'
)
[System.IO.File]::WriteAllText($manifestPath, $manifest, $utf8NoBom)

$hitCount = ([regex]::Matches($html, [regex]::Escape($newBuild))).Count +
            ([regex]::Matches($html, [regex]::Escape("?v=$sha"))).Count
Write-Host "Done. Updated $hitCount occurrences. Build: $newBuild" -ForegroundColor Green
