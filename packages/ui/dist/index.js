'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var react$1 = require('@icon-park/react');
var ui = require('@ume/ui');
var antd = require('antd');

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var DEFAULT_STYLE = `rounded-md border-1 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/99 font-medium text-white`;
var Button = (_a) => {
  var _b = _a, {
    helper,
    children,
    customCSS,
    loadingIconColor = "white",
    isLoading = false,
    isOutlinedButton = false,
    icon,
    type = "submit",
    isDisabled = false
  } = _b, props = __objRest(_b, [
    "helper",
    "children",
    "customCSS",
    "loadingIconColor",
    "isLoading",
    "isOutlinedButton",
    "icon",
    "type",
    "isDisabled"
  ]);
  const btnClass = DEFAULT_STYLE + (isDisabled ? ` ${isOutlinedButton ? "!bg-[#e9eef5] !text-slate-800 opacity-60" : "!bg-slate-300"}` : ` ${isOutlinedButton && "border border-slate-300"}`) + (customCSS ? ` ${customCSS}` : "");
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: btnClass, children: /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      __spreadProps(__spreadValues({}, props), {
        type,
        disabled: isDisabled,
        className: "w-full h-full btn",
        tabIndex: 99,
        style: { borderRadius: 3 },
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-center gap-x-2", children: [
          isLoading && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: `spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent dark:border-navy-300 dark:border-r-transparent ${loadingIconColor === "white" ? "border-white" : "border-black"}`
            }
          ),
          icon && /* @__PURE__ */ jsxRuntime.jsx("span", { children: icon }),
          children
        ] })
      })
    ) }),
    helper && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "button-helper", children: helper })
  ] });
};
var TextInput = ({
  icon,
  type,
  placeholder,
  name,
  value,
  disabled = false,
  required = false,
  title,
  onChange,
  onClick,
  onBlur,
  state,
  subtitle,
  className,
  error,
  minLength,
  maxLength
}) => {
  const [showPassword, setShowPassword] = react.useState(false);
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-[16px]", children: [
      title,
      " ",
      required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-ume-error", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "relative mt-1.5 flex items-center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          tabIndex: 99,
          className: `text-base bg-[#FFFFFF] form-input dark:border-navy-450 peer w-full rounded border px-3 py-2 placeholder:text-slate-400/70
            ${disabled ? "cursor-not-allowed bg-slate-100" : ""}
            ${icon ? "pl-9" : ""}
            ${error ? "!border-ume-error !hover:border-ume-error !focus:border-ume-error !focus:outline-ume-error" : "border-slate-300 hover:border-ume-blue focus-visible:border-ume-blue focus:border-ume-blue focus:outline-ume-blue dark:hover:border-navy-400 dark:focus:border-accent"}
            ${type === "password" ? "pr-9" : ""}`,
          type: showPassword ? "text" : type,
          placeholder: placeholder ? placeholder : `Enter your ${title}`,
          name,
          value,
          disabled,
          title,
          onChange,
          onClick,
          onBlur,
          minLength,
          maxLength
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute flex items-center justify-center w-10 h-full pointer-events-none peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent text-slate-400", children: icon })
    ] }),
    subtitle && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1.5 text-slate-400 text-[.6875rem]", children: subtitle }),
    error && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mt-1.5 inline-block text-ume-error text-[14px]", children: error })
  ] }) });
};
var CustomDrawer = (_a) => {
  var _b = _a, {
    customOpenBtn,
    openBtn,
    footer,
    isSearch,
    children,
    drawerTitle
  } = _b; __objRest(_b, [
    "customOpenBtn",
    "openBtn",
    "footer",
    "isSearch",
    "children",
    "drawerTitle"
  ]);
  const [searchTex, setSearchText] = react.useState("");
  const [drawerOpen, setDrawerOpen] = react.useState(false);
  const onSearch = () => console.log(searchTex);
  console.log(open);
  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const onClose = () => {
    setDrawerOpen(false);
  };
  const drawerFooter = () => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between px-6 py-4 text-white", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "my-auto text-1xl font-bold", children: "1 units total 4.75" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-x-4 flex items-center self-end", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            onClick: onClose,
            name: "register",
            customCSS: "bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[120px] text-[15px] font-nunito",
            type: "button",
            children: "Tho\xE1t"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            name: "register",
            customCSS: "bg-[#7463F0] py-2 rounded-3xl max-h-10 w-[120px] hover:scale-105 text-[15px] font-nunito",
            type: "button",
            children: "Thu\xEA"
          }
        )
      ] })
    ] });
  };
  const drawerHeader = () => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 p-6 space-x-5 text-white", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400", children: /* @__PURE__ */ jsxRuntime.jsx(react$1.ArrowRight, { onClick: onClose, theme: "outline", size: "24", fill: "#fff" }) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "my-auto text-3xl font-bold", children: drawerTitle })
      ] }),
      isSearch && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center self-end", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          react$1.Search,
          {
            theme: "outline",
            size: "32",
            fill: "#fff",
            className: "p-2 mt-2 mr-2 rounded-full hover:bg-gray-700 active:bg-gray-500",
            onClick: onSearch
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
          {
            placeholder: "T\xECm ki\u1EBFm...",
            value: searchTex,
            type: "text",
            name: "categorySearch",
            onChange: (e) => setSearchText(e.target.value),
            className: "text-black w-[11rem]"
          }
        )
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { onClick: showDrawer, className: customOpenBtn, children: openBtn }),
    /* @__PURE__ */ jsxRuntime.jsx(
      antd.Drawer,
      {
        className: "bg-black",
        title: drawerHeader(),
        placement: "right",
        footer: footer && drawerFooter(),
        closable: false,
        onClose,
        open: drawerOpen,
        children
      }
    )
  ] });
};

exports.Button = Button;
exports.CustomDrawer = CustomDrawer;
exports.TextInput = TextInput;
