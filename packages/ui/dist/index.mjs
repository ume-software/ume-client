import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, Fragment as Fragment$1 } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { CloseSmall, CheckOne, Attention, LoadingFour } from '@icon-park/react';

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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: btnClass, children: /* @__PURE__ */ jsx(
      "button",
      __spreadProps(__spreadValues({}, props), {
        type,
        disabled: isDisabled,
        className: "w-full h-full btn",
        tabIndex: 99,
        style: { borderRadius: 3 },
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-2", children: [
          isLoading && /* @__PURE__ */ jsx(
            "span",
            {
              className: `spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent dark:border-navy-300 dark:border-r-transparent ${loadingIconColor === "white" ? "border-white" : "border-black"}`
            }
          ),
          icon && /* @__PURE__ */ jsx("span", { children: icon }),
          children
        ] })
      })
    ) }),
    helper && /* @__PURE__ */ jsx("span", { className: "button-helper", children: helper })
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
  const [showPassword, setShowPassword] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxs("span", { className: "text-[16px]", children: [
      title,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-ume-error", children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "relative mt-1.5 flex items-center", children: [
      /* @__PURE__ */ jsx(
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
      /* @__PURE__ */ jsx("span", { className: "absolute flex items-center justify-center w-10 h-full pointer-events-none peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent text-slate-400", children: icon })
    ] }),
    subtitle && /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-slate-400 text-[.6875rem]", children: subtitle }),
    error && /* @__PURE__ */ jsx("span", { className: "mt-1.5 inline-block text-ume-error text-[14px]", children: error })
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
  const [searchTex, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onSearch = () => console.log(searchTex);
  console.log(open);
  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const onClose = () => {
    setDrawerOpen(false);
  };
  const drawerFooter = () => {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 text-white", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "my-auto text-1xl font-bold", children: "1 units total 4.75" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-x-4 flex items-center self-end", children: [
        /* @__PURE__ */ jsx(
          Button$1,
          {
            onClick: onClose,
            name: "register",
            customCSS: "bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[120px] text-[15px] font-nunito",
            type: "button",
            children: "Tho\xE1t"
          }
        ),
        /* @__PURE__ */ jsx(
          Button$1,
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
    return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 p-6 space-x-5 text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-5", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400", children: /* @__PURE__ */ jsx(ArrowRight, { onClick: onClose, theme: "outline", size: "24", fill: "#fff" }) }),
        /* @__PURE__ */ jsx("span", { className: "my-auto text-3xl font-bold", children: drawerTitle })
      ] }),
      isSearch && /* @__PURE__ */ jsxs("div", { className: "flex items-center self-end", children: [
        /* @__PURE__ */ jsx(
          Search,
          {
            theme: "outline",
            size: "32",
            fill: "#fff",
            className: "p-2 mt-2 mr-2 rounded-full hover:bg-gray-700 active:bg-gray-500",
            onClick: onSearch
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput$1,
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: showDrawer, className: customOpenBtn, children: openBtn }),
    /* @__PURE__ */ jsx(
      Drawer,
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

// src/modal/modal.tsx
var modal_exports = {};
__export(modal_exports, {
  useAlertError: () => useAlertError,
  useEditableForm: () => useEditableForm,
  useLoading: () => useLoading,
  useRiskConfirm: () => useRiskConfirm,
  useSuccess: () => useSuccess
});
var useSuccess = ({ show, onClose, title, message, closeButton }) => {
  const cancelButtonRef = useRef(null);
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Transition.Root, { show: show || false, as: Fragment$1, children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      className: "relative z-50 dialog-container",
      initialFocus: cancelButtonRef,
      onClose: handleClose,
      children: [
        /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-full p-4 text-center sm:p-0", children: /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5", children: [
              /* @__PURE__ */ jsx(
                CloseSmall,
                {
                  onClick: handleClose,
                  onKeyDown: (e) => e.key === "Enter" && handleClose(),
                  tabIndex: 1,
                  className: "absolute float-right rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ",
                  theme: "outline",
                  size: "30",
                  fill: "#000"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "m-auto", children: /* @__PURE__ */ jsx(CheckOne, { theme: "outline", size: "70", fill: "#00B549" }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold dark:text-navy-100", children: title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 mb-10 text-base", children: message }),
                typeof closeButton === "string" ? /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleClose,
                    customCSS: "btn bg-kmsconnect-primary hover:bg-kmsconnect-primary-focus focus:bg-kmsconnect-primary-focus active:bg-kmsconnect-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white",
                    children: closeButton
                  }
                ) : closeButton
              ] })
            ] })
          }
        ) }) })
      ]
    }
  ) }) });
};
var useAlertError = ({ show, onClose, title, message, closeButton, colorIcon = "#FF0000" }) => {
  const cancelButtonRef = useRef(null);
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Transition.Root, { show: show || false, as: Fragment$1, children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      className: "relative z-50 dialog-container",
      initialFocus: cancelButtonRef,
      onClose: handleClose,
      children: [
        /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-full p-4 text-center sm:p-0", children: /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5", children: [
              /* @__PURE__ */ jsx(
                CloseSmall,
                {
                  onClick: handleClose,
                  onKeyDown: (e) => e.key === "Enter" && handleClose(),
                  tabIndex: 1,
                  className: "absolute float-right rounded-full cursor-pointer right-2 top-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ",
                  theme: "outline",
                  size: "30",
                  fill: "#000"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "m-auto", children: /* @__PURE__ */ jsx(Attention, { theme: "outline", size: "70", fill: colorIcon }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold dark:text-navy-100", children: title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 mb-10 text-base", children: message }),
                typeof closeButton === "string" ? /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleClose,
                    customCSS: "btn bg-kmsconnect-error hover:bg-kmsconnect-error-focus focus:bg-kmsconnect-error-focus active:bg-kmsconnect-error-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white",
                    children: closeButton
                  }
                ) : closeButton
              ] })
            ] })
          }
        ) }) })
      ]
    }
  ) }) });
};
var DEFAULT_PANEL_STYLE = "relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full";
var DEFAULT_TITLE_STYLE = "text-lg font-medium leading-6 text-gray-900";
var useRiskConfirm = ({
  show,
  onClose,
  title,
  message,
  closeButton,
  okButton,
  form,
  closeOnConfirm = true,
  panelCustomCss,
  titleCustomCss
}) => {
  const panelClass = panelCustomCss ? panelCustomCss : DEFAULT_PANEL_STYLE;
  const titleClass = titleCustomCss ? titleCustomCss : DEFAULT_TITLE_STYLE;
  const cancelButtonRef = useRef(null);
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Transition.Root, { show: show || false, as: Fragment$1, children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      className: "relative z-50 dialog-container",
      initialFocus: cancelButtonRef,
      onClose: handleClose,
      onClick: (e) => {
        e.stopPropagation();
        handleClose();
      },
      children: [
        /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-full p-4 text-center sm:p-0", children: /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: panelClass, children: [
              /* @__PURE__ */ jsx(
                CloseSmall,
                {
                  onClick: handleClose,
                  onKeyDown: (e) => e.key === "Enter" && handleClose(),
                  tabIndex: 1,
                  className: "absolute float-right rounded-full cursor-pointer top-1 right-1 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 ",
                  theme: "outline",
                  size: "30",
                  fill: "#808080"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "justify-center px-10 pt-10 bg-white sm:p-4 sm:pt-10", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center w-12 h-12 mx-auto rounded-full sm:mr-2 sm:ml-4 sm:h-10 sm:w-10", children: /* @__PURE__ */ jsxs("svg", { width: "49", height: "49", viewBox: "0 0 49 49", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M24.5002 44.9173C30.138 44.9173 35.2422 42.6321 38.9369 38.9374C42.6316 35.2427 44.9168 30.1385 44.9168 24.5006C44.9168 18.8628 42.6316 13.7586 38.9369 10.0639C35.2422 6.3692 30.138 4.08398 24.5002 4.08398C18.8623 4.08398 13.7581 6.3692 10.0634 10.0639C6.36871 13.7586 4.0835 18.8628 4.0835 24.5006C4.0835 30.1385 6.36871 35.2427 10.0634 38.9374C13.7581 42.6321 18.8623 44.9173 24.5002 44.9173Z",
                        stroke: "#FF0000",
                        "stroke-width": "3.8",
                        "stroke-linejoin": "round"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M24.5 29.222V25.1387C27.8827 25.1387 30.625 22.3964 30.625 19.0137C30.625 15.6309 27.8827 12.8887 24.5 12.8887C21.1173 12.8887 18.375 15.6309 18.375 19.0137",
                        stroke: "#FF0000",
                        "stroke-width": "3.5",
                        "stroke-linecap": "square",
                        "stroke-linejoin": "round"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        "fill-rule": "evenodd",
                        "clip-rule": "evenodd",
                        d: "M24.4998 38.4089C25.9093 38.4089 27.0519 37.2662 27.0519 35.8568C27.0519 34.4473 25.9093 33.3047 24.4998 33.3047C23.0904 33.3047 21.9478 34.4473 21.9478 35.8568C21.9478 37.2662 23.0904 38.4089 24.4998 38.4089Z",
                        fill: "#FF0000"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center sm:mt-0", children: [
                    /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: titleClass, children: title }),
                    /* @__PURE__ */ jsx("div", { className: "mt-1 ", children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-gray-500", children: message }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { children: form ? form : "" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-center flex-1 mt-3 mb-10 sm:px-6", children: [
                typeof closeButton === "string" ? /* @__PURE__ */ jsx(
                  Button,
                  {
                    customCSS: "btn mr-2 bg-gray-200 hover:bg-gray-200-focus focus:bg-gray-200-focus active:bg-gray-200-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-black",
                    onClick: handleClose,
                    children: closeButton
                  }
                ) : closeButton,
                typeof okButton === "string" ? /* @__PURE__ */ jsx(
                  "span",
                  {
                    onClick: () => {
                      if (!closeOnConfirm) {
                        return null;
                      }
                      onClose();
                    },
                    children: /* @__PURE__ */ jsx(Button, { customCSS: "btn bg-kmsconnect-primary hover:bg-kmsconnect-primary-focus focus:bg-kmsconnect-primary-focus active:bg-kmsconnect-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white", children: okButton })
                  }
                ) : /* @__PURE__ */ jsx(
                  "span",
                  {
                    onClick: () => {
                      if (!closeOnConfirm) {
                        return null;
                      }
                      onClose();
                    },
                    children: okButton
                  }
                )
              ] })
            ] })
          }
        ) }) })
      ]
    }
  ) }) });
};
var useEditableForm = ({
  show,
  onClose,
  title,
  form,
  onOK,
  closeButtonOnConner,
  backgroundColor
}) => {
  const cancelButtonRef = useRef(null);
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Transition.Root, { show: show || false, as: Fragment$1, children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      className: "relative z-50 dialog-container",
      initialFocus: cancelButtonRef,
      onClose: handleClose,
      children: [
        /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-full text-center sm:p-0", children: /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsxs(
              Dialog.Panel,
              {
                className: `relative overflow-hidden text-left transition-all transform rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full ${backgroundColor ? `bg-[${backgroundColor}]` : "bg-white"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between pt-6 pb-3 mx-4 rounded-t-lg dark:bg-navy-800 sm:px-5", children: [
                    /* @__PURE__ */ jsx("h3", { className: "flex items-center text-xl font-medium text-bg-kmsconnect-textGrey dark:text-navy-100", children: title }),
                    closeButtonOnConner ? closeButtonOnConner : /* @__PURE__ */ jsx(
                      CloseSmall,
                      {
                        onClick: handleClose,
                        onKeyDown: (e) => e.key === "Enter" && handleClose(),
                        tabIndex: 1,
                        className: "absolute rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ",
                        theme: "outline",
                        size: "30",
                        fill: "#000"
                      }
                    )
                  ] }),
                  form
                ]
              }
            )
          }
        ) }) })
      ]
    }
  ) }) });
};
var useLoading = ({ show, onClose, title, message, closeButton }) => {
  const cancelButtonRef = useRef(null);
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Transition.Root, { show: show || false, as: Fragment$1, children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      className: "relative z-50 dialog-container",
      initialFocus: cancelButtonRef,
      onClose: handleClose,
      children: [
        /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-full p-4 text-center sm:p-0", children: /* @__PURE__ */ jsx(
          Transition.Child,
          {
            as: Fragment$1,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5", children: [
              /* @__PURE__ */ jsx("div", { className: "m-auto", children: /* @__PURE__ */ jsx("div", { className: "animate-spin", children: /* @__PURE__ */ jsx(LoadingFour, { theme: "outline", size: "70", className: "animate-spin", fill: "#27AAE1" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold dark:text-navy-100", children: title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 mb-10 text-base", children: message }),
                typeof closeButton === "string" ? /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleClose,
                    customCSS: "btn bg-kmsconnect-grey hover:bg-kmsconnect-grey-focus focus:bg-kmsconnect-grey-focus active:bg-kmsconnect-grey-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white",
                    disabled: true,
                    children: closeButton
                  }
                ) : closeButton
              ] })
            ] })
          }
        ) }) })
      ]
    }
  ) }) });
};

export { Button, modal_exports as Modal, TextInput };
