fly deploy --app serbot-site --detach
fly scale count 0
Start-Sleep -Seconds 10
fly scale count 1