import { ERROR_MESSAGE, REGEX } from "../apis/Constant";

const leftTrim = (string) => {
	return (string ?? "").toString().trim();
};

const markAllAsTouched = (object) => {
	return Object.keys(object).reduce((accumulator, key) => {
		return { ...accumulator, [key]: true };
	}, {});
};

const leftTrimAllValue = (object, exceptLeftTrimValues = []) => {
	if (object) {
		return Object?.keys(object).reduce((accumulator, key) => {
			return {
				...accumulator,
				[key]: exceptLeftTrimValues.find((element) => element === key)
					? object[key]
					: leftTrim(object[key]),
			};
		}, {});
	} else return null;
};

const getErrorMessage = (key, value, isOptional) => {
	if (
		(value && value?.toString().match(REGEX[key])) ||
		(isOptional && (!value || (value && value?.toString().match(REGEX[key]))))
	)
		return "";
	else {
		return !value
			? `${ERROR_MESSAGE[key + "Required"] ?? "This field is required"}`
			: `${ERROR_MESSAGE[key + "Invalid"]}`;
	}
};

const isFormValid = (formValue, optionalFields) => {
	for (var key in formValue) {
		if (formValue[key] === null) {
			formValue[key] = "";
		}
		if (formValue[key] && formValue[key].toString().match(REGEX[key])) continue;
		else if (
			optionalFields &&
			optionalFields[key] &&
			formValue[key].toString().match(REGEX[key])
		) {
			continue;
		} else return false;
	}
	return true;
};

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const camelCase = (str) => {
	return str
		.split(/(?=[A-Z])/)
		.map(function (p) {
			return p.charAt(0).toUpperCase() + p.slice(1);
		})
		.join(" ");
};

const filterNavSideBarItems = (navItems, menus) => {
	console.log(navItems, menus, "FILTER++++++++ SIDEBAR");
	let SIDEBAR = []
	const allowedIds = menus
		.filter((menu) =>
			menu.menu_features.some(
				(feature) => feature.feature_name === "view" && feature.prop
			)
		)
		.map((menu) => menu.menu_id);

	SIDEBAR = navItems.reduce((acc, item) => {
		if (item.items) {
			const filteredChildren = filterNavSideBarItems(item.items, menus);
			if (filteredChildren?.length > 0) {
				acc.push({ ...item, items: filteredChildren });
			}
		} else {
			if (item.menu_id && allowedIds.includes(item.menu_id)) {
				acc.push(item);
			}
		}
		return acc;
	}, []);


	let DEFAULT_ITEM = navItems.filter((_m) => {
		if (_m.menu_id == -1) return _m
		
	});

	
	SIDEBAR.unshift(...DEFAULT_ITEM)
	console.log(SIDEBAR, "SIDEBAR+++++++++++++++++++")

	return SIDEBAR;
};


function createFeatureFlags(features) {
  const featureMap = features.reduce((acc, feature) => {
    acc[feature.feature_name.toLowerCase()] = feature.prop === true;
    return acc;
  }, {});

  return {
    isView: () => featureMap['view'] || false,
    isCreate: () => featureMap['add'] || false,
    isEdit: () => featureMap['edit'] || false,
    isDelete: () => featureMap['delete'] || false,
  };
}

export {
	leftTrim,
	getErrorMessage,
	markAllAsTouched,
	leftTrimAllValue,
	isFormValid,
	numberWithCommas,
	camelCase,
	filterNavSideBarItems,
	createFeatureFlags,
};
