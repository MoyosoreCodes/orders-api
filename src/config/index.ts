export default () => ({
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    email_host: process.env.EMAIL_HOST,
    mongo_db_uri: process.env.MONGO_DB_URI
});