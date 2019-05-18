/**
 * @swagger
 * definitions:
 *   StatusCode:
 *     type: object
 *     description: "status code"
 *     properties:
 *       SUCCESS:
 *         type: integer
 *         description: "success"
 *         value: 0
 *       FAIL:
 *         type: integer
 *         description: "fail"
 *         value: 0
 */

let code = {
  SUCCESS: 0,   // success
  FAIL   : 1    // fail

}

let errorStatus = function (errCode, message) {
  let err = new Error(message)
  err.code = errCode
  err.status = 200
  return err
}
export default code
export { errorStatus }