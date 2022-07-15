function checkPermissions(req, res, next) {
    const method = req.method.toLowerCase();
    const entity = req.originalUrl.split('/')[1];

    const role = req.user.role.name;
    const permissions = role.permissions;

    const permission = permissions.find(permission => permission.entity === entity && permission[method] === true);

    if (!permission) {
        throw new Error('You do not have permission to do this');
    }
    next();
}

module.exports = checkPermissions;