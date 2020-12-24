const zapper =
  "data:image/png;base64,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";
export default zapper;
