## Build docker

```
    docker compose -f docker-compose.prod.yml up --build -d
```

```
    docker compose -f docker-compose.dev.yml up --build -d
```

## Set CORS for buckets

- Create json file:

```
    echo '[{"origin": ["http://localhost:6200/", "https://release.antmusic.net/"],"responseHeader": ["*"],"method": ["*"],"maxAgeSeconds": 3600}]' > cors-config.json
```

- Set CORS for buckets:

```
    gsutil cors set cors-config.json gs://ant-music-assets
```

```
    gsutil cors set cors-config.json gs://ant-music-assets-protected
```

- View config CORS for buckets:

```
    gsutil cors get gs://ant-music-assets
```

```
    gsutil cors get gs://ant-music-assets-protected
```
