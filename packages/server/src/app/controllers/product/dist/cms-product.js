"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.deleteProductById = exports.getProductById = exports.updateProduct = exports.createProduct = exports.getListProductManage = void 0;
var db_1 = require("../../../lib/db");
var constant_1 = require("../../../constant");
exports.getListProductManage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, pageSize, currentPage, sortBy, brandId, categoryId, rating, isShow, pagination, whereClause, select, total, listProduct, _b, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, search = _a.search, pageSize = _a.pageSize, currentPage = _a.currentPage, sortBy = _a.sortBy, brandId = _a.brandId, categoryId = _a.categoryId, rating = _a.rating, isShow = _a.isShow;
                pagination = {
                    skip: (Number(currentPage !== null && currentPage !== void 0 ? currentPage : 1) - 1) * Number(pageSize !== null && pageSize !== void 0 ? pageSize : constant_1.PAGE_SIZE),
                    take: Number(pageSize !== null && pageSize !== void 0 ? pageSize : constant_1.PAGE_SIZE)
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 34, , 35]);
                whereClause = {};
                if (brandId) {
                    whereClause.brandId = String(brandId);
                }
                if (categoryId) {
                    whereClause.categoryId = String(categoryId);
                }
                if (rating) {
                    whereClause.rating = Number(rating);
                }
                if (isShow) {
                    whereClause.isShow = isShow === 'true';
                }
                select = {
                    id: true,
                    name: true,
                    brand: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: { name: true }
                    },
                    createdAt: true,
                    isShow: true,
                    original_price: true,
                    quantity: true,
                    rating: true,
                    size: true,
                    sold_quantity: true,
                    discount_price: true
                };
                return [4 /*yield*/, db_1.db.product.count({
                        where: __assign({ name: {
                                contains: String(search || '')
                            } }, whereClause)
                    })];
            case 2:
                total = _c.sent();
                listProduct = void 0;
                _b = sortBy;
                switch (_b) {
                    case 'LATEST': return [3 /*break*/, 3];
                    case 'OLDEST': return [3 /*break*/, 5];
                    case 'NAME_A_TO_Z': return [3 /*break*/, 7];
                    case 'NAME_Z_TO_A': return [3 /*break*/, 9];
                    case 'RATE_HIGHT_TO_LOW': return [3 /*break*/, 11];
                    case 'RATE_LOW_TO_HIGHT': return [3 /*break*/, 13];
                    case 'PRICE_LOW_TO_HIGHT': return [3 /*break*/, 15];
                    case 'PRICE_HIGHT_TO_LOW': return [3 /*break*/, 17];
                    case 'DISCOUNT_PRICE_LOW_TO_HIGHT': return [3 /*break*/, 19];
                    case 'DISCOUNT_PRICE_HIGHT_TO_LOW': return [3 /*break*/, 21];
                    case 'QUANTITY_LOW_TO_HIGHT': return [3 /*break*/, 23];
                    case 'QUANTITY_HIGHT_TO_LOW': return [3 /*break*/, 25];
                    case 'SOLD_QUANTITY_LOW_TO_HIGHT': return [3 /*break*/, 27];
                    case 'SOLD_QUANTITY_HIGHT_TO_LOW': return [3 /*break*/, 29];
                }
                return [3 /*break*/, 31];
            case 3: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        createdAt: 'desc'
                    }, select: select }))];
            case 4:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 5: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        createdAt: 'asc'
                    }, select: select }))];
            case 6:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 7: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        name: 'asc'
                    }, select: select }))];
            case 8:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 9: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        name: 'desc'
                    }, select: select }))];
            case 10:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 11: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        rating: 'desc'
                    }, select: select }))];
            case 12:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 13: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        rating: 'asc'
                    }, select: select }))];
            case 14:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 15: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        original_price: 'asc'
                    }, select: select }))];
            case 16:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 17: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        original_price: 'desc'
                    }, select: select }))];
            case 18:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 19: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        discount_price: 'asc'
                    }, select: select }))];
            case 20:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 21: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        discount_price: 'desc'
                    }, select: select }))];
            case 22:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 23: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        quantity: 'asc'
                    }, select: select }))];
            case 24:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 25: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        quantity: 'desc'
                    }, select: select }))];
            case 26:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 27: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        sold_quantity: 'asc'
                    }, select: select }))];
            case 28:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 29: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        sold_quantity: 'desc'
                    }, select: select }))];
            case 30:
                listProduct = _c.sent();
                return [3 /*break*/, 33];
            case 31: return [4 /*yield*/, db_1.db.product.findMany(__assign(__assign({}, pagination), { where: __assign({ name: {
                            contains: search ? String(search) : undefined
                        } }, whereClause), orderBy: {
                        createdAt: 'desc'
                    }, select: select }))];
            case 32:
                listProduct = _c.sent();
                _c.label = 33;
            case 33: return [2 /*return*/, res.status(200).json({
                    isOk: true,
                    data: listProduct,
                    message: 'Get list product successfully!',
                    pagination: {
                        total: total
                    }
                })];
            case 34:
                error_1 = _c.sent();
                return [2 /*return*/, res.sendStatus(500)];
            case 35: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, brandId, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    original_price, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    discount_price, quantity, description, size, categoryId, thumbnail, isShow, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    product_image, product, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, brandId = _a.brandId, original_price = _a.original_price, discount_price = _a.discount_price, quantity = _a.quantity, description = _a.description, size = _a.size, categoryId = _a.categoryId, thumbnail = _a.thumbnail, isShow = _a.isShow, product_image = _a.product_image;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.product.create({
                        data: {
                            name: name,
                            brandId: brandId,
                            original_price: original_price,
                            discount_price: discount_price,
                            quantity: quantity,
                            description: description,
                            size: size,
                            categoryId: categoryId,
                            thumbnail: thumbnail,
                            isShow: isShow,
                            product_image: {
                                createMany: {
                                    data: product_image
                                }
                            }
                        }
                    })];
            case 2:
                product = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        isOk: true,
                        data: product,
                        message: 'Create new product successfully!'
                    })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error!' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, brandId, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    original_price, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    discount_price, quantity, description, size, categoryId, thumbnail, isShow, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    product_image, product, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, brandId = _a.brandId, original_price = _a.original_price, discount_price = _a.discount_price, quantity = _a.quantity, description = _a.description, size = _a.size, categoryId = _a.categoryId, thumbnail = _a.thumbnail, isShow = _a.isShow, product_image = _a.product_image;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db.productImage.deleteMany({
                        where: {
                            productId: id
                        }
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, db_1.db.product.update({
                        where: {
                            id: id
                        },
                        data: {
                            name: name,
                            brandId: brandId,
                            original_price: original_price,
                            discount_price: discount_price,
                            quantity: quantity,
                            description: description,
                            size: size,
                            categoryId: categoryId,
                            thumbnail: thumbnail,
                            isShow: isShow,
                            product_image: {
                                createMany: {
                                    data: product_image
                                }
                            }
                        }
                    })];
            case 3:
                product = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        isOk: true,
                        data: product,
                        message: 'Update new product successfully!'
                    })];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error!' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getProductById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.product.findUnique({
                        where: {
                            id: id
                        },
                        include: {
                            product_image: {
                                select: {
                                    id: true,
                                    url: true
                                }
                            },
                            brand: {
                                select: {
                                    name: true
                                }
                            },
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    })];
            case 2:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(400).json({
                            isOk: false,
                            data: null,
                            message: 'This product does not exist!'
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        isOk: true,
                        data: product,
                        message: 'Get product successfully!'
                    })];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProductById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.product["delete"]({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                product = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        isOk: true,
                        data: product,
                        message: 'Delete product successfully!'
                    })];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); };
