# For project running

```ecmascript 6
npm install
```
and then, you need to write your configure to .env as I created .env.example

then, you need to migrate this migration, because of this you need to run migration js in database
        
```ecmascript 6
node src/database/migration.js
```
OR 

```javascript
cd src 
cd database
node migration.js
```
After this you can run project with command
```ecmascript 6
npm run start
```

# Endpoints

$baseurl = 'http://localhost:{your port}'

to upload file you need to write file to form-data -
```
${baseurl}/api/upload
```


to see whole files by user id and you need to give user_id in body in GET method
```ecmascript 6
${baseurl}/drives/by-user
```

to see whole files by folder, you need to give folder_id in body in GET method

```ecmascript 6
${baseurl}/drives/by-file
```

to download file you need to give aws_location_id after drives/ in GET method
```javascript
${baseurl}/drives/{aws_location_id}
```

to share information with all give id of file after share-all in PATCH method
```javascript
${baseurl}/drives/share-all/{file_id}
```
to share information with email, you need to give in body aws_locationid,email of user who want to share,role_id, if role_id is 1 it's means user can write and read, if 2 onyl read
```javascript
${baseurl}/drives/share
```

to create folder give folder_name in body

```javascript
${baseurl}/folder
```

to register user give email and password in body and POST method
```javascript
${baseurl}/user
```

to signin email and password in body
```javascript
${baseurl}/user/signin
```


