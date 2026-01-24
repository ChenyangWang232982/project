const {Note, User} = require('../models');
const { protect } = require('../middleware/auth.middleware');
//get notes
exports.getNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await Note.findAll({
            where: {userId},
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                }
            ] 
        });
        res.status(200).json(notes);
    } catch (err) {
        console.error('Failure to load notes: ', err);
        res.status(500).json({ message: 'Server error'});
    }
};

//create notes
exports.createNote = async (req, res) => {
    const userId = req.user.id;
    const {title, content, category} = req.body;

    //validation
    if (!title || !content) {
        return res.status(400).json({message: 'Cannot be empty'});
    }
    try {
        const newNote = await Note.create({
            serId,
            title,
            content,
            category: category || 'default',
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                }
            ] 
        });
        res.status(201).json(newNote);
    } catch (err) {
        console.error('Failure to create:', err)
        res.status(500).json({message: 'Server error, failure to create note'})
    }
};

//update notes
exports.updateNote = async (req,res) => {
    const userId = req.user.id;
    const {id} = req.params;
    const {title, content, category} = req.body;

    try {
        //Check if the note exists
        const note = await Note.findOne({
            where: {
                id,
                userId
            }
        });
        if (!note) {
            return res.status(404).json({message: 'Note does not exist'})
        }

        //update notes
        await note.update({
            title: title || note.title,
            content: content || note.content,
            category: category || note.category
        });

        res.status(200).json(note);
    } catch (err) {
        console.error('Failure to update', err);
        res.status(500).json({ message: 'Server error, failure to update notes'});
    }
};

exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
         const note = await Note.findOne({
            where: {
                id,
                userId
            }
        });
        if(!note) {
            return res.status(404).json({message: 'Note does not exist'});
        }
        await note.destroy();
        res.status(200).json({message: 'Deleted note successfully'});
    } catch (err) {
        console.error('Failure to delete note', err);
        res.status(500).json({message: 'Server error, failure to delete note'});
    }
};

exports.getNoteById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const note = await Note.findOne({
            where: {
                id,
                userId
            }
        });
        if(!note) {
            return res.status(404).json({message: 'Note does not exist'});
        }
        res.status(200).json(note);
    } catch (err) {
        console.error('Failure to get note', err);
        res.status(500).json({message: 'Server error, failure to get note'});
    }
};