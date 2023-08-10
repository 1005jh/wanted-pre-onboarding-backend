if (Test-Path '.cert') { Remove-Item -Recurse -Force '.cert' }
New-Item -ItemType Directory -Force -Path '.cert'
mkcert -key-file './.cert/key.pem' -cert-file './.cert/cert.pem' 'localhost'