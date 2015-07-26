# unveil.js

A reveal.js simplifier

---

## Slide 1

This is the first slide. There are others like it. But this one's
mine.

---

## Some math

$$ a^c + b^c = c^2 $$

## Some code

```
bool freezing_slow_path(struct task_struct *p)
{
	if (p->flags & (PF_NOFREEZE | PF_SUSPEND_TASK))
		return false;

	if (test_thread_flag(TIF_MEMDIE))
		return false;

	if (pm_nosig_freezing || cgroup_freezing(p))
		return true;

	if (pm_freezing && !(p->flags & PF_KTHREAD))
		return true;

	return false;
}
EXPORT_SYMBOL(freezing_slow_path);
```
