# Cdn-combo Documentation


## What is cdn-combo?
> cdn-combo is a tool that can help you to combine multiple files into one file. It is very useful when you want to reduce the number of requests to the server.


## use case example:
- react external


## What the architecture like ?
### example http request
```
/v1??axios/1.1.2/dist/esm/axios.min.js,bootstrap/5.3.0-alpha1/dist/js/bootstrap.bundle.js
```

#### explain `/v1`
> `/v1` is the version of cdn-combo, it is used to distinguish the version of cdn-combo. If you want to upgrade the version of cdn-combo, you can change the version number of the url, In this way, you can use the new version of cdn-combo without affecting the old version of cdn-combo.


#### explain `??`
> `??` is the separator of cdn-combo, it is used to distinguish the file list and the version of cdn-combo. If you want to upgrade the version of cdn-combo, you can change the version number of the url, In this way, you can use the new version of cdn-combo without affecting the old version of cdn-combo.


#### explain `axios/1.1.2/dist/esm/axios.min.js,bootstrap/5.3.0-alpha1/dist/js/bootstrap.bundle.js`
> `axios/1.1.2/dist/esm/axios.min.js,bootstrap/5.3.0-alpha1/dist/js/bootstrap.bundle.js` is the file list, it is used to distinguish the file list. `axios` is the name of the package, `1.1.2` is the version of the package, `dist/esm/axios.min.js` is the path of the file in the package. So we define the distinguished each file in the list by `[packageName]/[packageVersion]/[filePath]`.


### Deploy architecture
> CDN-combo server => CDN server => client


### Build and RUN
```
git clone https://github.com/tsaowe/cdn-combo.git
cd cdn-combo
docker build -t cdn-combo-image .
# run with name cdn-combo-container host port 9999 inner port 4000
docker run -d --name cdn-combo-container -p 9999:4000 cdn-combo-image
```
