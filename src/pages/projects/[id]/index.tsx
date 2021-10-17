import Head from 'next/head';
import Link from 'next/link';
import Router from "next/router";
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CollectionIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import { ConfirmDeleteModal, EmptyState, Heading, ProjectDataDisplay, Snippet, Comments, Loader, Button } from '../../../components';
import { AppLayout } from '../../../layouts';
import { ApolloClient, Mutations, Queries } from '../../../helpers';

const AppProjectDetail: NextPage = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
	const { loading, data } = useQuery(Queries.getProject, {
		variables: { id }
	});
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [deleteProject] = useMutation(Mutations.deleteProject, {
		variables: { id },
	});

	const handleDeleteProject = async (): Promise<void> => {
		setIsConfirmModalOpen(false);

		await deleteProject();

		Router.push("/projects");
	}

	return (
		<AppLayout>
			<Head>
				<title>{data?.project.name || "Your project"} - speedback</title>
			</Head>

			<main>
				<Heading title={data?.project.name || "Your project"} backLink={{ url: "/projects", label: "Back to projects" }}>
					<div className="-my-1.5 -mx-2 mt-5 flex flex-wrap lg:mt-0">
						<Button
							type="button"
							onClick={() => setIsConfirmModalOpen(true)}
							icon={TrashIcon}
							danger
							className="my-1.5 mx-2"
						>
							Delete project
						</Button>

						<Button
							url={`/projects/${data?.project.id}/edit`}
							icon={PencilIcon}
							className="my-1.5 mx-2"
						>
							Edit project
						</Button>
					</div>
				</Heading>

				{loading ? (
					<Loader />
				) : (
					<section className="2xl:container container-spacing section-spacing">
						{data?.project ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
								<ProjectDataDisplay className="max-w-xl col-span-2 md:col-span-1" data={data.project}></ProjectDataDisplay>

								<Comments className="col-span-2 md:col-span-1" projectId={data.project.id} comments={data.project.comments} />

								<Snippet className="col-span-2" id={data.project.id} />
							</div>
						) : (
							<EmptyState title="This project was not found." icon={CollectionIcon}>
								<Link
									href="/projects"
								>
									<a className="mt-8 my-1.5 mx-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										<EyeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
										View all projects
									</a>
								</Link>
							</EmptyState>
						)}
					</section>
				)}
			</main>

			<ConfirmDeleteModal
				title={`Deleting "${data?.project.name}"`}
				description="Are you sure you want to delete this project? This action cannot be reversed."
				action={handleDeleteProject}
				closeAction={setIsConfirmModalOpen}
				isOpen={isConfirmModalOpen}
			/>
		</AppLayout>
	)
}

export const getStaticPaths = async () => {
	const { data: { projects } } = await ApolloClient.query({
		query: Queries.getProjects,
	});

	const paths = projects.map((project: any) => ({
		params: { id: project.id },
	}));

	return {
	  paths,
	  fallback: 'blocking'
	};
}

export const getStaticProps: GetStaticProps = ({ params }) => {
	return {
		props: {
			id: params?.id,
		},
	}
}

export default AppProjectDetail;
