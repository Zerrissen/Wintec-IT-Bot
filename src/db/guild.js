/**-------------------------------------------------------
 * *                   INFO
 *   This is the guild table interaction file. It contains
 *   functions that interact with the guild table as queries.
 *----------------------------------------------------**/

/*------------------ REQUIRES -----------------*/

const { PrismaClient } = require("@prisma/client");

/*--------------- END OF REQUIRES --------------*/

const prisma = new PrismaClient();

/**======================
 **   Creates a new guild in the database.
 *@param data The guild data to be created.
 *@returns A promise that resolves to the created guild.
 *========================**/
async function createGuild(data) {
  return prisma.guild.create({ data });
}

/**======================
 **   Fetches a guild by its ID.
 *@param guildId The ID of the guild to be fetched.
 *@returns A promise that resolves to the fetched guild.
 *========================**/
async function getGuild(guildId) {
  return prisma.guild.findUnique({ where: { guildId } });
}

/**======================
 **   Updates a guild in the database.
 *@param data The guild data to be updated.
 *@returns A promise that resolves to the updated guild.
 *========================**/
async function updateGuild(data) {
  return prisma.guild.update({ where: { guildId: data.guildId }, data });
}

/**======================
 **   Upserts a guild in the database. Creates if doesn't exist, otherwise updates.
 *@param data The guild data to be upserted.
 *@returns A promise that resolves to the upserted guild.
 *========================**/
async function upsertGuild(data) {
  return prisma.guild.upsert({ where: { guildId: data.guildId }, update: data, create: data });
}
module.exports = {
  createGuild,
  getGuild,
  updateGuild,
  upsertGuild,
};
