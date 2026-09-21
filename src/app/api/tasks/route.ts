import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_PATH = path.join(process.cwd(), 'src', 'data', 'audit_tasks.json');

function getTasks() {
  try {
    if (!fs.existsSync(TASKS_PATH)) return [];
    const raw = fs.readFileSync(TASKS_PATH, 'utf-8');
    return JSON.parse(raw).tasks || [];
  } catch (err) {
    console.error('Error reading tasks:', err);
    return [];
  }
}

function saveTasks(tasks: any[]) {
  try {
    fs.writeFileSync(TASKS_PATH, JSON.stringify({ tasks }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving tasks:', err);
    throw err;
  }
}

export async function GET() {
  const tasks = getTasks();
  const total = tasks.length;
  const completed = tasks.filter((t: any) => t.status === 'done').length;
  const pending = total - completed;
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(0) : '0';

  return NextResponse.json({
    metrics: {
      total,
      completed,
      pending,
      completionRate,
    },
    tasks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tasks = getTasks();

    if (body.action === 'toggle' && body.taskId) {
      const task = tasks.find((t: any) => t.id === body.taskId);
      if (task) {
        task.status = task.status === 'done' ? 'todo' : 'done';
        task.completedAt = task.status === 'done' ? new Date().toISOString() : null;
        saveTasks(tasks);
        return NextResponse.json({ success: true, task });
      }
    }

    if (body.action === 'add' && body.newTask) {
      const newTask = {
        id: 'task-' + Math.random().toString(36).substring(2, 8),
        title: body.newTask.title,
        category: body.newTask.category || 'Genel',
        owner: body.newTask.owner || 'AI',
        ownerLabel: body.newTask.owner === 'USER' ? 'Yönetici (Sen)' : 'Yapay Zeka',
        frequency: body.newTask.frequency || 'Tek Seferlik',
        status: 'todo',
        description: body.newTask.description || '',
        auditNotes: 'Kullanıcı tarafından panele eklendi.',
      };
      tasks.push(newTask);
      saveTasks(tasks);
      return NextResponse.json({ success: true, task: newTask });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err) {
    console.error('Task API error:', err);
    return NextResponse.json({ success: false, error: 'Failed updating tasks' }, { status: 500 });
  }
}
