import { NodeEnv } from "@lib/NodeEnv";
import { FileInput } from "@pipeline/File";
import {
    generateDatabase as _generateDatabase,
    generateReportSite as _generateReportSite,
} from "@pipeline/process/Generate";
import { Database, ReportConfig } from "@pipeline/Types";

export const generateDatabase = async (files: FileInput[], config: ReportConfig) =>
    _generateDatabase(files, config, NodeEnv);

export const generateReportSite = async (database: Database) => _generateReportSite(database, NodeEnv);
