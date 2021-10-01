import { FunctionComponent } from 'react';
import {
	ArrowSmLeftIcon,
	CalendarIcon,
	ChatAltIcon,
} from '@heroicons/react/outline';
import Link from "next/link";

import { DateUtils } from "../helpers";
import { Stat } from './index';

type CtaProps = {
	title: string;
	subtitle: string;
}

const Cta: FunctionComponent<CtaProps> = ({ children, title, subtitle }) => {
	return (
		<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
			<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
				<span className="block">
					{title}
				</span>
				<span className="block text-indigo-500">
					{subtitle}
				</span>
			</h2>

			<div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
				<div className="inline-flex rounded-md shadow">
					<a
						href="#"
						className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
					>
						Get started
					</a>
				</div>

				<div className="ml-3 inline-flex rounded-md shadow">
					<a
						href="#"
						className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
					>
						Learn more
					</a>
				</div>
			</div>
		</div>
	)
}

export default Cta;
