export const handlerReadiness = (req, res) => {
    res.set("Content-Type", "text/plain");
    res.status(200).send("OK");
};
