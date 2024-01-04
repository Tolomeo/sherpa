import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'

const GithubIconLink = () => {
  return (
    <IconButton
      color="inherit"
      aria-label="Go to repository"
			// TODO: verify how to fix turbo
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      href={process.env.NEXT_PUBLIC_GITHUB_URL!}
    >
      <GitHubIcon />
    </IconButton>
  )
}

export default GithubIconLink
