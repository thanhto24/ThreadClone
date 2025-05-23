const Account = require("../models/Account");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createAccount = async (email, password, username) => {
    const users = await User.find({}).exec(); // lấy tất cả user
    const new_user_id = 1111 + users.length;

    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new Account({
        email,
        password: hashedPassword,
        user_id: new_user_id.toString(),
        username
    });

    try {
        const user = new User({
            user_id: new_user_id.toString(),
            user_name: username,
            full_name: username,
            tag: username,
            bio: 'New User Bio of ' + username,
            avt_url: '', 
            num_follow: 0, // Mặc định số người theo dõi là 0
            link_fb: 'https://www.facebook.com/', // Mặc định link fb
            follow_status: 'Theo dõi', // Mặc định là 'Not Following'
            followers: [], // Mảng followers, mặc định là rỗng
            following: [] // Mảng following, mặc định là rỗng
        });

        // Lưu user vào database
        await user.save();
        //console.log('User added successfully!');
    } catch (err) {
        console.error('Error adding user:', err);
    }

    return await account.save();
};

const getAccountById = async (accountId) => {
    const account = await Account.findById(accountId).select("-password");

    if (!account) {
        throw new Error("Account not found");
    }
    return account;
};

const getAccountByEmail = async (email) => {
    const account = await Account.findOne({ email }).select("-password");
    if (!account) {
        throw new Error("Account not found");
    }
    return account;
};

const getAccountByUsername = async (username) => {
    const account = await Account.findOne({ username }).select("-password");
    if (!account) {
        throw new Error("Account not found");
    }
    return account;
};

const deleteAccount = async (accountId) => {
    const account = await Account.findByIdAndDelete(accountId);
    if (!account) {
        throw new Error("Account not found");
    }
    return account;
};

const updateAccount = async (email, newPassword) => {
    const account = await Account.findOne({ email })
    if (!account) {
        throw new Error("Account not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //console.log("CHECK PASS SAU KHI HASH: ", hashedPassword);
    account.password = hashedPassword;

    await account.save();

    return { message: "Password updated successfully" };
};

const authenticateAccount = async (input, password) => {
    let account;
    
    // Kiểm tra nếu input là email hay username và tìm tài khoản tương ứng
    if (input.includes('@')) {
        // Nếu input có dấu @ thì chắc chắn là email
        account = await Account.findOne({ email: input });
    } else {
        // Nếu không phải email thì coi như là username
        account = await Account.findOne({ username: input });
    }

    // Nếu không tìm thấy tài khoản, báo lỗi
    if (!account) {
        throw new Error("Invalid email/username or password");
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
        throw new Error("Invalid email/username or password");
    }

    return account;
};

module.exports = {
    createAccount,
    getAccountById,
    getAccountByEmail,
    getAccountByUsername,
    deleteAccount,
    updateAccount,
    authenticateAccount,
};
