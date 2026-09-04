export default async function enrollmentHook(enrollment) {
	const currentYear = new Date().getFullYear();

	const totalEnrollments = await enrollment.constructor.count();
	const sequencial = String(totalEnrollments + 1).padStart(3, '0');

	enrollment.registration_number = `${currentYear}${sequencial}`;
}
