const validateRow = (rowData, config) => {
    const errors = []
  
    Object.entries(config.columns).forEach(([columnName, columnConfig]) => {
      const value = rowData[columnConfig.dbField]
  
      if (columnConfig.required && (value === undefined || value === "")) {
        errors.push(`${columnName} is required`)
      }
  
      if (value !== undefined && value !== "") {
        switch (columnConfig.type) {
          case "number":
            if (isNaN(value) || (columnConfig.min !== undefined && value < columnConfig.min)) {
              errors.push(
                `${columnName} must be a number ${columnConfig.min !== undefined ? `greater than or equal to ${columnConfig.min}` : ""}`,
              )
            }
            break
          case "date":
            if (!(value instanceof Date) || isNaN(value)) {
              errors.push(`${columnName} must be a valid date`)
            } else if (columnConfig.validator && !columnConfig.validator(value)) {
              errors.push(`${columnName} does not meet the date validation criteria`)
            }
            break
          case "boolean":
            if (typeof value !== "boolean" && !["yes", "no", "true", "false"].includes(value.toLowerCase())) {
              errors.push(`${columnName} must be a valid Yes/No value`)
            }
            break
        }
      }
    })
  
    return {
      isValid: errors.length === 0,
      errors,
    }
  }
  
  module.exports = { validateRow }
  
  