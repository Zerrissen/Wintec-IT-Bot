/**-------------------------------------------------------
 * *                   INFO
 *   This is the user table interaction file. It contains
 *   functions that interact with the user table as queries.
 *----------------------------------------------------**/

/*------------------ REQUIRES -----------------*/

const { PrismaClient } = require("@prisma/client");

/*--------------- END OF REQUIRES --------------*/

const prisma = new PrismaClient();

/**======================
 **   Creates a new user in the database.
 *@param data The user data to be created.
 *@returns A promise that resolves to the created user.
 *========================**/
async function createUser(data) {
  return prisma.user.create({ data });
}

/**======================
 **   Retrieves a user from the database based on their email.
 *@param email The email of the user to retrieve.
 *@returns A Promise that resolves to the user object if found, or null if not found.
 *========================**/
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

/**======================
 **   Retrieves a user by their Discord ID.
 *@param discordId The Discord ID of the user.
 *@returns A Promise that resolves to the user object if found, or null if not found.
 *========================**/
async function getUserById(discordId) {
  return prisma.user.findUnique({ where: { discordId } });
}

/**======================
 **   Retrieves a list of unverified users from the database.
 *@returns A promise that resolves to an array of User objects.
 *========================**/
async function getUnverifiedUsers() {
  return prisma.user.findMany({ where: { verified: false } });
}

/**======================
 **   Updates a user in the database.
 *@param data The user data to be updated.
 *@returns A promise that resolves to the updated user.
 *========================**/
async function updateUser(data) {
  return prisma.user.update({ where: { discordId: data.discordId }, data });
}

/**======================
 **   Upserts a user in the database.
 *@param data The user data to be upserted.
 *@returns A promise that resolves to the upserted user.
 *========================**/
async function upsertUser(data) {
  return prisma.user.upsert({ where: { discordId: data.discordId }, update: data, create: data });
}

/**======================
 **   Increments a user's wizard points by 1.
 *@param discordId The Discord ID of the user to update.
 *@returns A promise that resolves to the updated user.
 *========================**/
async function incrementWizardPoints(discordId) {
  return prisma.user.update({
    where: { discordId },
    data: { wizardPoints: { increment: 1 } },
  });
}

/**======================
 **   Decrements a user's wizard points by 1.
 *@param discordId The Discord ID of the user to update.
 *@returns A promise that resolves to the updated user.
 *========================**/
async function decrementWizardPoints(discordId) {
  return prisma.user.update({
    where: { discordId },
    data: { wizardPoints: { decrement: 1 } },
  });
}

/**======================
 **   Gets the top 10 users with the most wizard points.
 *@returns A promise that resolves to the list of users
 *========================**/
async function getTopUsers() {
  return prisma.user.findMany({ orderBy: { wizardPoints: "desc" }, take: 10 });
}

//! WARNING: This function should only be used to resolve issues. We don't want to delete data from the database!
/**======================
 **   Deletes a user from the database.
 *@param discordId The Discord ID of the user to delete.
 *@returns A promise that resolves to the deleted user.
 *========================**/
async function deleteUser(discordId) {
  return prisma.user.delete({ where: { discordId } });
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUnverifiedUsers,
  updateUser,
  upsertUser,
  incrementWizardPoints,
  decrementWizardPoints,
  getTopUsers,
  deleteUser,
};
