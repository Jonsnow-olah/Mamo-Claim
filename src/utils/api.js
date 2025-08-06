export async function fetchCodes(projectSlug) {
  const token = localStorage.getItem('adminToken');


  const res = await fetch(`/api/admin/codes?projectSlug=${projectSlug}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });


  if (!res.ok) throw new Error('Failed to fetch codes');
  return res.json();
}


export async function createProject(name) {
  const token = localStorage.getItem('adminToken');


  const res = await fetch('/api/admin/create-project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });


  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}


export async function uploadCSV(projectSlug, csvFile) {
  const token = localStorage.getItem('adminToken');


  const formData = new FormData();
  formData.append('csv', csvFile);
  formData.append('projectSlug', projectSlug);


  const res = await fetch('/api/admin/upload-codes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });


  if (!res.ok) throw new Error('Failed to upload CSV');
  return res.json();
}


// ✅ Added this function
export async function fetchProjects() {
  const token = localStorage.getItem('adminToken');


  const res = await fetch('/api/admin/projects', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });


  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}
