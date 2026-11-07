import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function RemoveApplicationDialog({ record, scholarshipName, onCancel, onConfirm }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (record && !dialog.open) dialog.showModal()
    if (!record && dialog.open) dialog.close()
  }, [record])
  return <dialog ref={dialogRef} className="tracker-confirm-dialog" aria-labelledby="tracker-remove-title" onCancel={(event) => { event.preventDefault(); onCancel() }} onClick={(event) => { if (event.target === dialogRef.current) onCancel() }}>
    <span className="tracker-confirm-icon"><AlertTriangle size={20} /></span><p className="page-eyebrow">Local demo record</p><h2 id="tracker-remove-title">Remove this application?</h2><p>This removes the locally stored tracker record for <strong>{scholarshipName || record?.scholarshipId}</strong>. No scholarship provider will be contacted.</p><div className="tracker-confirm-actions"><Button variant="secondary" onClick={onCancel}>Keep record</Button><Button className="tracker-confirm-destructive" onClick={onConfirm}>Remove record</Button></div>
  </dialog>
}
