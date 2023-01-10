import Koa from "koa";
import Router from "@koa/router";
import * as v1 from "./src/v1.js";

const port = 4001;
const app = new Koa();

const router = new Router();

//  view system info
router.get("/api/system", v1.system);

//  search suggest
router.get("/api/search/suggestions", v1.searchSuggests);

//  v1
router.get("/v1", v1.main);

// view package version list
//  1. group package, eg: @koa/router
router.get("/api/view/@:scope/:packageName", v1.viewGroupPackage);
//  2. simple package,eg: koa
router.get("/api/view/:packageName", v1.viewSimplePackage);

//  view package at specific version dist tree
//  1. group package, eg: @koa/router/1.0.0
router.get("/api/view/@:scope/:packageName/:version", v1.viewGroupPackageTree);
//  2. simple package,eg: koa/1.0.0
router.get("/api/view/:packageName/:version", v1.viewSimplePackageTree);

//  register router
app.use(router.routes()).use(router.allowedMethods());

//  start server at port
app.listen(port);
