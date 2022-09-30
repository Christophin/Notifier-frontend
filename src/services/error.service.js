
const handleError = (err) => {
  console.log("encountered an error", err);
  const resMessage =
    (err.response &&
    err.response.data &&
    err.response.data.message)
    ?
      err.response.data.message
      :
      err.message
      ? err.message : err.toString();

    return {
      message: resMessage
    }

}

const ErrorService = {
  handleError
}

export default ErrorService;
