const restrictDirectoryAccess = (req, res, next) => {
    if (req.path.endsWith('/')) {
        return res.status(403).send('403 Forbidden: Access to this resource on the server is denied!');
    }
    next();
}

module.exports = restrictDirectoryAccess