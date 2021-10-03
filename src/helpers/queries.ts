import { DocumentNode, gql } from "@apollo/client";

const Queries: { [key: string]: DocumentNode } = {};

Queries.getLandingPage = gql`
	query {
		landingPage(where: { id: "cku9ux4uoe39q0c10qw2549nj" }) {
				heroTitle
				heroDescription
				heroVisual {
					url
				}
				featuresEyebrow
				featuresTitle
				featuresDescription
				features {
					id
					title
					description
					icon
				}
				pricing {
					eyebrow
					title
					description
					monthlyCost
					yearlyCost
				}
			}
		}
`;

Queries.getGlobals = gql`
	query ($issuer: String!) {
		comments(
			first: 1,
			orderBy: createdAt_DESC
		) {
			createdAt
		}
		commentsConnection {
			aggregate {
				count
			}
		}
		authUser(where: { issuer: $issuer }) {
			pricingPlan
		}
	}
`;

Queries.getUser = gql`
	query ($issuer: String!) {
		authUser(where: {issuer: $issuer}) {
			id
			email
			pricingPlan
		}
	}
`;

Queries.getProject = gql`
	query ($id: ID!) {
		project(where: {id: $id}) {
			id
			name
			url
			description
			createdByAuthUser {
				email
			}
			authUser {
				issuer
				email
			}
			comments {
				id
				text
				url
				resolved
				metaInfo
				createdAt
				authUser {
					email
				}
			}
		}
	}
`;

Queries.getProjects = gql`
	query {
		projects {
			id
			name
			url
			description
			comments {
				id
			}
		}
	}
`;

Queries.getCommentsByProject = gql`
	query ($projectId: ID!) {
		comments(
			where: {project: {id: $projectId}},
			orderBy: createdAt_ASC
		) {
			id
			text
			resolved
			metaInfo
			elementSelector
			authUser {
				id
				email
			}
		}
	}
`;

export default Queries;
