const axios = require('axios')

const lab = axios.create({
  baseURL: 'https://gitlab.com/api/v4/',
  headers: { 'PRIVATE-TOKEN': process.env.TOKEN }
})
lab.interceptors.response.use((response) => response.data)

async function main() {
  const projects = await lab.get('/projects?owned=true')
  const mirroredProjects = projects.filter(({ mirror }) => mirror)
  const projectIds = mirroredProjects.map(({ id, name }) => ({ id, name }))
  const responses = projectIds.map(({ id, name }) => {
    return lab.delete(`/projects/${id}`)
  })
  // eslint-disable-next-line no-console
  console.log(await Promise.all(responses))
}

main()
