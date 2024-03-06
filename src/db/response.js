/**-------------------------------------------------------
 * *                   INFO
 *   This is the response table interaction file. It contains
 *   functions that interact with the response table as queries.
 *----------------------------------------------------**/

/*------------------ REQUIRES -----------------*/

const { PrismaClient } = require("@prisma/client");
/*--------------- END OF REQUIRES --------------*/

const prisma = new PrismaClient();

/**======================
 **   Creates a new response in the database.
 *@param data The response data to be created.
 *@returns A promise that resolves to the created response.
 *========================**/
async function createResponse(data) {
  return prisma.response.create({ data });
}

/**======================
 **   Retrieves a count of responses from the database.
 *@returns A promise that resolves to a count of Response objects.
 *========================**/
async function getResponseCount() {
  return prisma.response.count();
}

/**======================
 **   Retrieves a count of responses from the database by type.
 *@param type The type of response to count.
 *@returns A promise that resolves to a count of Response objects.
 *========================**/
async function getResponseCountByType(type) {
  return prisma.response.count({ where: { type } });
}

/**======================
 **   Retrieves a random response from the database by type.
 *@param type The type of response to retrieve.
 *@returns A Promise that resolves to the response object if found, or null if not found.
 *========================**/
async function getRandomResponseByType(type) {
  //* Definitely NOT the most efficient (literally the slowest) way to do this. But our dataset is small so not that big an issue.
  return prisma.$queryRaw`SELECT * FROM response WHERE type = ${type} ORDER BY random() LIMIT 1`;
}

/**======================
 **   Retrieves a response from the database based on its ID.
 *@param id The ID of the response to retrieve.
 *@returns A Promise that resolves to the response object if found, or null if not found.
 *========================**/
async function getResponseById(id) {
  return prisma.response.findUnique({ where: { id } });
}

//! WARNING: This function should only be used to resolve issues. We don't want to delete data from the database!
/**======================
 ** Deletes a response from the database.
 * @param id - The ID of the response to delete.
 * @returns A Promise that resolves to the deleted response.
 *========================**/
async function deleteResponse(id) {
  return prisma.response.delete({ where: { id } });
}

module.exports = {
  createResponse,
  getResponseCount,
  getResponseCountByType,
  getRandomResponseByType,
  getResponseById,
  deleteResponse,
};
