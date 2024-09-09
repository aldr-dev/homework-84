import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import auth, {RequestWithUser} from '../middleware/auth';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = new Task({
      user: req.user?._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    await task.save();
    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const tasks = await Task.find({user: req.user?._id});

    if (tasks.length === 0) {
      return res.status(404).send({error: 'Tasks not found'});
    }

    return res.send(tasks);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      return res.status(403).send({error: 'You do not have permission to edit this task'});
    }

    if (req.body.title) {
      task.title = req.body.title;
    }
    if (req.body.description) {
      task.description = req.body.description;
    }
    if (req.body.status) {
      task.status = req.body.status;
    }

    await task.save();
    return res.send(task);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      return res.status(403).send({error: 'You do not have permission to delete this task'});
    }

    await Task.findByIdAndDelete(task);
    return res.send({message: 'Task deleted successfully'});
  } catch (error) {
    return next(error);
  }
});


export default tasksRouter;