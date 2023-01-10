import { Subject } from "rxjs";

export const KEY_OF_SEARCH_HISTORY = "searchHistory";
export const KEY_OF_CART = "cart";
export const ALLOW_ADD_CART_TYPES = [".js", ".css"];

export const SubjectOfAddToCart = new Subject();
