import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.route.js'


const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/users', userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));