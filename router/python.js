const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');

// 匯出路由
module.exports = (root) => {
    // # python script handler
    const execPython = async (scriptPath, args) => {
        const arguments = args.map(arg => arg.toString());

        // check python to prevent system break
        if (!fs.existsSync(process.env.PYTHON_PATH)) {
            console.error(`Python not found at ${process.env.PYTHON_PATH}`);
            throw new Error('Python not found');
        }
    
        const py = spawn(process.env.PYTHON_PATH, [scriptPath, ...arguments]);
    
        return await new Promise((resolve, reject) => {
    
            let output = '';
            let errorOutput = '';
    
            py.stdout.on('data', (data) => {
                output += JSON.parse(data);
            });
    
            py.stderr.on('data', (data) => {
                console.error(`[python] stderr: ${data}`);
                reject(`Error occured in ${script}`);
            });
    
            py.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
                } else {
                    resolve(output);
                }
            });
        });
    }
    
    router.get('/:file', async (req, res) => {
        const args = [req.query.param1 || '0', req.query.param2 || '0']
        const file = req.params.file;
        console.log(`python script: ${file}, args: ${args}`);
    
        try {
            const result = await execPython(path.join(root, 'python', `${file}.py`), args)
            res.json({result :result});
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    

    router.get('/', async (req, res) => {
        res.status(400).sendFile(path.join(root, 'python', 'index.html'));
    })

    return router
}