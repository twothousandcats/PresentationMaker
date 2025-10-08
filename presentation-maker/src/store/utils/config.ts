const defaultSlideWidth = 240;
const selectors = {
    portalRoot: 'portal-root',
};
const getPortal = () => {
    return document.getElementById(selectors.portalRoot);
}

export {
    defaultSlideWidth,
    getPortal
}