import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'

const GithubIconLink = () => {
  return (
    <IconButton
      color="inherit"
      aria-label="Go to repository"
      href={process.env.NEXT_PUBLIC_GITHUB_URL!}
    >
      <GitHubIcon />
    </IconButton>
  )
}

export default GithubIconLink
