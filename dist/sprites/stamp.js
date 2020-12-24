const stamp = "data:image/png;base64,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";
export default stamp;
//# sourceMappingURL=stamp.js.map