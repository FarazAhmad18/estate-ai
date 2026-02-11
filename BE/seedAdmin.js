require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const sequelize = require('./config/db')
const User = require('./models/User')
const bcrypt = require('bcrypt')

async function seed() {
  try {
    await sequelize.authenticate()
    console.log('DB connected')

    const exists = await User.findOne({ where: { email: 'admin@gmail.com' } })
    if (exists) {
      console.log('Admin user already exists, updating role to Admin...')
      await exists.update({ role: 'Admin' })
      console.log('Done!')
      process.exit(0)
    }

    const hash = await bcrypt.hash('123456', 10)
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hash,
      role: 'Admin',
    })

    console.log('Admin user created successfully!')
    console.log('Email: admin@gmail.com')
    console.log('Password: 123456')
    process.exit(0)
  } catch (err) {
    console.error('Error seeding admin:', err)
    process.exit(1)
  }
}

seed()
