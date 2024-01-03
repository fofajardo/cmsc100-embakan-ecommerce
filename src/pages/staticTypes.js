const productTypes = [
    {
        id: "unpublished",
        label: "⛔ Unpublished",
        value: 0,
        isPrivate: true,
    },
    {
        id: "crops",
        label: "🌾 Crops",
        value: 1,
    },
    {
        id: "poultry",
        label: "🐔 Poultry",
        value: 2,
    },
];

const roleTypes = [
    {
        id: "shopper",
        label: "Shopper/Buyer",
        value: 0,
    },
    {
        id: "seller",
        label: "Seller/Merchant",
        value: 1,
    },
    {
        id: "administrator",
        label: "Site Administrator",
        value: 2,
    },
];

function getFriendlyRoleName(aRole) {
    if (isNaN(aRole) || aRole < 0 || aRole >= roleTypes.length) {
        return "Invalid";
    }

    return roleTypes[aRole].label;
}

function getFriendlyTypeName(aType) {
    if (isNaN(aType) || aType < 0 || aType >= productTypes.length) {
        return "Invalid";
    }

    return productTypes[aType].label;
}

export { productTypes, getFriendlyTypeName, getFriendlyRoleName };
