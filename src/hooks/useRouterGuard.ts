import { useEffect } from 'react';
import Router from "next/router";

const HOME_URL = "/home";

interface RouterGuardProps {
	isLoggedIn: boolean;
	isLoading: boolean;
}

const useRouterGuard = ({ isLoggedIn, isLoading }: RouterGuardProps) => {
	// If user is not logged in, we should redirect.
	useEffect(() => {
		if (isLoading || Router.pathname === HOME_URL) {
			return;
		}

		if (!isLoggedIn && Router.pathname !== HOME_URL) {
			Router.push(HOME_URL);
		}
	}, [isLoading, isLoggedIn]);
}

export default useRouterGuard;
