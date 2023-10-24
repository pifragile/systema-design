import { MongoClient } from "mongodb";
// import bcrypt from "bcrypt";
// import { getRandomPassword } from "./util.js";

class Database {
    constructor() {
        this.dbClient = new MongoClient(process.env.DB_CONNECTION_STRING, {
            ssl: true,
            // sslValidate: true,
        });
        this.db = this.dbClient.db("nexteis");
        this.eis = this.db.collection("eis");
    }

    async getAll() {
        return (await this.eis.find({})).toArray();
    }
    // async insertIntoGeneralCache(cacheIdentifier, query, data) {
    //     await this.generalCache.replaceOne(
    //         { ...query, cacheIdentifier },
    //         { ...query, cacheIdentifier, data },
    //         {
    //             upsert: true,
    //         }
    //     );
    // }
    // async getFromGeneralCache(cacheIdentifier, query) {
    //     return (
    //         await (
    //             await this.generalCache.find({ ...query, cacheIdentifier })
    //         ).toArray()
    //     ).map((e) => e.data);
    // }

    // async insertIntoAccountDataCache(account, year, month, cid, data) {
    //     await this.accountData.replaceOne(
    //         { account, year, month, cid },
    //         { account, year, month, cid, data },
    //         {
    //             upsert: true,
    //         }
    //     );
    // }
    // async getFromAccountDataCache(account, year, cid) {
    //     return (
    //         await (
    //             await this.accountData.find({ account, year, cid })
    //         ).toArray()
    //     ).map((e) => e.data);
    // }

    // async getFromAccountDataCacheByMonth(month, year, cid) {
    //     return (
    //         await (await this.accountData.find({ month, year, cid })).toArray()
    //     ).map((e) => e.data);
    // }

    // async insertIntoRewardsDataCache(cid, data) {
    //     await this.rewardsData.replaceOne(
    //         { cid },
    //         { cid, data },
    //         {
    //             upsert: true,
    //         }
    //     );
    // }

    // async getFromRewardsDataCache(cid) {
    //     return this.rewardsData.findOne({ cid });
    // }

    // async checkUserCredentials(address, password) {
    //     const user = await this.users.findOne({ address });
    //     if (!user) return null;
    //     if (await bcrypt.compare(password, user.passwordHash)) return user;
    //     return null;
    // }

    // async upsertUser(address, password, name, isAdmin = false) {
    //     await this.users.replaceOne(
    //         { address },
    //         {
    //             address,
    //             name,
    //             passwordHash: await bcrypt.hash(password, 10),
    //             isAdmin,
    //         },
    //         {
    //             upsert: true,
    //         }
    //     );
    // }

    // async setPassword(address, password) {
    //     await this.users.updateOne(
    //         { address },
    //         { $set: { passwordHash: await bcrypt.hash(password, 10) } }
    //     );
    // }

    // async addUserToCommunities(address, cids) {
    //     await this.communities.updateMany(
    //         { cid: { $in: cids } },
    //         { $push: { accounts: address } }
    //     );
    // }

    // async removeUserFromAllCommunities(address) {
    //     await this.communities.updateMany({}, { $pull: { accounts: address } });
    // }

    // async createUser(address, name, cids) {
    //     if (await this.getUser(address)) throw Error("User Exists");
    //     const password = getRandomPassword();
    //     this.upsertUser(address, password, name);
    //     this.addUserToCommunities(address, cids);
    //     return password;
    // }

    // async deleteUser(address) {
    //     await this.users.deleteOne({ address });
    //     await this.removeUserFromAllCommunities(address);
    // }

    // async getUser(address) {
    //     return this.users.findOne(
    //         { address },
    //         { projection: { address: 1, name: 1, isAdmin: 1, _id: 0 } }
    //     );
    // }

    // async updateUser(address, name, cids) {
    //     await this.users.updateOne({ address }, { $set: { name } });
    //     await this.removeUserFromAllCommunities(address);
    //     await this.addUserToCommunities(address, cids);
    // }

    // async getAllUsers() {
    //     return this.users
    //         .find(
    //             {},
    //             { projection: { address: 1, name: 1, isAdmin: 1, _id: 0 } }
    //         )
    //         .toArray();
    // }

    // async getCommunityUsers(cid) {
    //     const community = await this.getCommunity(cid);
    //     return this.users
    //         .find({ address: { $in: community.accounts } })
    //         .toArray();
    // }

    // async getCommunity(cid) {
    //     return this.communities.findOne({ cid });
    // }

    // async getAllCommunities() {
    //     return this.communities
    //         .find({}, { projection: { cid: 1, name: 1, _id: 0 } })
    //         .toArray();
    // }

    // async getVoucherAddresses(cid) {
    //     return (
    //         await this.vouchers
    //             .find({ cid }, { projection: { address: 1 } })
    //             .toArray()
    //     ).map((e) => e.address);
    // }

    // async getGovAddresses(cid) {
    //     return (
    //         await this.knows_addresses
    //             .find({ cid, type: "gov" }, { projection: { address: 1 } })
    //             .toArray()
    //     ).map((e) => e.address);
    // }
    // async getAcceptancePointAddresses(cid) {
    //     return (
    //         await this.communities.findOne(
    //             { cid },
    //             { projection: { accounts: 1 } }
    //         )
    //     ).accounts;
    // }
}

const db = new Database();
export default db;
